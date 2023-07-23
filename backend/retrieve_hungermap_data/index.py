import os
import requests
import json
from sqlalchemy import Float, ForeignKey, create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import func
import datetime
import psycopg2


db_hostname = os.getenv('DB_HOST')

db_name = os.getenv('DB_NAME')

db_password = os.getenv('DB_PASSWORD')

db_user = os.getenv('DB_USER')

connection_string: str = f"postgresql://{db_user}:{db_password}@{db_hostname}/{db_name}"


Base = declarative_base()
now = datetime.datetime.utcnow

class Country(Base):
    __tablename__ = 'countries'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    iso3 = Column(String, nullable=False)
    iso2 = Column(String, nullable=False)

class Region(Base):
    __tablename__ = 'regions'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    population = Column(Integer)

class Metric(Base):
    __tablename__ = 'metrics'
    id = Column(Integer, primary_key=True)
    metric_name = Column(String, nullable=False)
    people = Column(Integer)
    prevalence = Column(Float)

class DataEntry(Base):
    __tablename__ = 'data_entries'
    id = Column(Integer, primary_key=True)
    date = Column(DateTime, default=now)
    data_type = Column(String, nullable=False)

    country_id = Column(Integer, ForeignKey('countries.id'))
    country = relationship('Country')

    region_id = Column(Integer, ForeignKey('regions.id'))
    region = relationship('Region')

    fcs_id = Column(Integer, ForeignKey('metrics.id'))
    fcs = relationship('Metric', foreign_keys=[fcs_id])

    rcsi_id = Column(Integer, ForeignKey('metrics.id'))
    rcsi = relationship('Metric', foreign_keys=[rcsi_id])

    market_access_id = Column(Integer, ForeignKey('metrics.id'))
    market_access = relationship('Metric', foreign_keys=[market_access_id])
    
    
def deserialize_json_to_models(json_data):
    data_e = json.loads(json_data)
    entries = []
    for data in data_e:
        # Extract data from JSON and create instances of the models
        country = Country(id=data['country']['id'], name=data['country']['name'],
                        iso3=data['country']['iso3'], iso2=data['country']['iso2'])

        region = Region(id=data['region']['id'], name=data['region']['name'],
                        population=data['region']['population'])

        fcs_metric = Metric(metric_name='fcs', people=data['metrics']['fcs']['people'],
                            prevalence=data['metrics']['fcs']['prevalence'])

        rcsi_metric = Metric(metric_name='rcsi', people=data['metrics']['rcsi']['people'],
                            prevalence=data['metrics']['rcsi']['prevalence'])

        market_access_metric = Metric(metric_name='marketAccess', people=data['metrics']['marketAccess']['people'],
                                    prevalence=data['metrics']['marketAccess']['prevalence'])

        data_entry = DataEntry(date=data['date'], data_type=data['dataType'],
                            country=country, region=region, fcs=fcs_metric, rcsi=rcsi_metric,
                            market_access=market_access_metric)
        entries.append(data_entry)

    return entries

def fetch_data(url):
    response = requests.get(url)
    return response.text


def retrieve_country_data(country_code):
    print(f"getting data, country: {country_code}")
    url = f"https://api.hungermapdata.org/v1/foodsecurity/country/{country_code}/region?date_start=2022-06-01&date_end=2023-07-01"  # Replace with your desired URL
    content = fetch_data(url)
    print(f"retireved data, country: {country_code}")
    # Save the fetched data to the PostgreSQL database
    print(f"saving data to database, country: {country_code}")
    inserted_id = save_to_database(content)
    print(f"Data saved for: {country_code}")

def save_to_database(content):
    engine = create_engine(connection_string, connect_args={'connect_timeout': 1})
    Base.metadata.create_all(engine)

    Session = sessionmaker(bind=engine)
    session = Session()
    data_entry = deserialize_json_to_models(content)
    for entry in data_entry:
        session.merge(entry)
        session.commit()
    session.close()


def handler(event, context):
    result = retrieve_country_data("COL")
    return {
        "statusCode": 200,
        "body": result
    }
    


def lambda_handler(*args):
    return handler(*args)
import os
import requests
import json
from sqlalchemy import Float, ForeignKey, create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import func, desc
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

    health_access_id = Column(Integer, ForeignKey('metrics.id'))
    health_access = relationship('Metric', foreign_keys=[health_access_id])
    
    
def retrieve_average_monthly_value(country_code,start_date,end_date):
    print(f"retrieve_average_monthly_value: {country_code}")
    engine = create_engine(connection_string, connect_args={'connect_timeout': 1})
    Session = sessionmaker(bind=engine)
    session = Session()
    print("get average monthly from database")
    result = session.query(
        Region.name,
        func.date_trunc('month', DataEntry.date).label('month'),
        func.avg(DataEntry.fcs_id).label('avg_fcs'),
        func.avg(DataEntry.rcsi_id).label('avg_rcsi'),
        func.avg(DataEntry.market_access_id).label('avg_market_access'),
        func.avg(DataEntry.health_access_id).label('avg_health_access')
    ).join(Region).join(Country).filter(
        Country.iso3 == country_code,
        DataEntry.date >= start_date,
        DataEntry.date <= end_date
    ).group_by(Region.name, func.date_trunc('month', DataEntry.date)).order_by(desc(func.date_trunc('month', DataEntry.date))).all()

    
    formatted_result = [
        {
            'region_name': row.name,
            'month': row.month.strftime('%Y-%m'),
            'avg_fcs': float(row.avg_fcs),
            'avg_rcsi': float(row.avg_rcsi),
            'avg_market_access': float(row.avg_market_access),
            'avg_health_access': float(row.avg_health_access)
        }
        for row in result
    ]
    json_result = json.dumps(formatted_result, indent=4)
    return json_result

def handler(event, context):
    start_date = '2022-06-01'
    end_date = '2023-07-01'
    query_params = event.get("queryStringParameters", {})
    if query_params is not None:
        if 'c_id' in query_params:
            c_id = query_params.get("c_id")
            average_monthly_value = retrieve_average_monthly_value(c_id,start_date,end_date)
            result = json.loads(average_monthly_value)
            if result:
                return {
                    "statusCode": 200,
                    "body": average_monthly_value
                }
            else:
                return {
                    "statusCode": 404,
                    "body": 'Country not found'
                }

        else:
            return {
                "statusCode": 400,
                "body": "Bad request"
            }
    else:
            return {
                "statusCode": 400,
                "body": "Bad request"
            }
    


def lambda_handler(*args):
    return handler(*args)
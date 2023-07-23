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
    
    
def variance_metric_b(country_code,start_date,end_date):
    print(f"daily_national_estimate: {country_code}")
    engine = create_engine(connection_string, connect_args={'connect_timeout': 1})
    Session = sessionmaker(bind=engine)
    session = Session()
    result = session.query(func.sum(Metric.prevalence), func.date_trunc('day', DataEntry.date)).\
            join(Country, DataEntry.country_id == Country.id).\
            join(Metric, DataEntry.fcs_id == Metric.id).\
            filter(Country.iso3 == country_code).\
            filter((DataEntry.data_type > start_date) | (DataEntry.data_type < end_date)).\
            group_by(func.date_trunc('day', DataEntry.date)).all()
    
    sum_value = 0
    squared_diff_sum = 0
    total_sum_value = sum(sum_value for sum_value, month in result)
    mean = total_sum_value / len(result)
    squared_diff_sum = sum((sum_value - mean) ** 2 for sum_value, month in result)
    
    variance = squared_diff_sum / (len(result) - 1)
    return variance

def handler(event, context):
    start_date = '2022-06-01'
    end_date = '2023-07-01'
    
    query_params = event.get("queryStringParameters", {})
    c_id = query_params.get("c_id")
    print(c_id == None)
    if c_id is not None:
        variance_metric_b_value = variance_metric_b(c_id,start_date,end_date)
        return {
            "statusCode": 200,
            "body": variance_metric_b_value
        }
    else:
        return {
            "statusCode": 400,
            "body": "Bad request"
        }
    


def lambda_handler(*args):
    return handler(*args)
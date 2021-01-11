import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { ApplicationState } from '../../store';
import { fetchForecasts, WeatherForecastsState, WeatherForecast } from './weatherForecastsSlice';


const Pagination = ({ startDateIndex, isLoading }: { startDateIndex?: number, isLoading: boolean }) => {
  const prevStartDateIndex = (startDateIndex || 0) - 5;
  const nextStartDateIndex = (startDateIndex || 0) + 5;
  return (
    <>
      <div className="d-flex justify-content-between">
        <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${prevStartDateIndex}`}>Previous</Link>
        {isLoading && <span>Loading...</span>}
        <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${nextStartDateIndex}`}>Next</Link>
      </div>

    </>
  )
};

export default () => {
  const { forecasts, isLoading } = useSelector<ApplicationState, WeatherForecastsState>(state => state.weatherForecasts);
  const params = useParams<{ startDateIndex: string }>();
  const startDateIndex = params.startDateIndex ? parseInt(params.startDateIndex) : 0;
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchForecasts(startDateIndex));
  })

  return (
    <>
      <h1 id="tabelLabel">Weather forecast</h1>
      <p>This component demonstrates fetching data from the server and working with URL parameters.</p>

      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map((forecast: WeatherForecast) =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination startDateIndex={startDateIndex} isLoading={isLoading} />
    </>
  );
};
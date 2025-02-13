# COVID-19 Statistics App

This Ionic application displays COVID-19 statistics for Canada and Ontario. The app features two main tabs:

1. Canada Summary Tab
   - Displays key COVID-19 updates for Canada
   - Shows Ontario status of cases

2. Ontario Tab
   - Displays Ontario status of cases
   - Shows detailed records with the ability to view more information
   - Includes messaging functionality between components

## Installation

1. Make sure you have Node.js and npm installed
2. Install Ionic CLI globally:
   ```bash
   npm install -g @ionic/cli
   ```
3. Install project dependencies:
   ```bash
   npm install
   ```

## Running the Application

To run the application in development mode:

```bash
ionic serve
```

## Data Sources

The application uses data from:
- Canada COVID-19 data: https://health-infobase.canada.ca/covid-19/epidemiological-summary-covid-19-cases.html
- Ontario COVID-19 data: https://covid-19.ontario.ca

## Features

- Real-time COVID-19 statistics display
- Interactive UI with tabs navigation
- Detailed record view
- Component communication using services
- Responsive design for various screen sizes

## Project Structure

- `src/app/services`: Contains the COVID data service
- `src/app/models`: Contains data models
- `src/assets/data`: Contains JSON data files
- `src/app/tab1`: Canada Summary tab component
- `src/app/tab2`: Ontario tab component
- `src/app/tab3`: Detail view component

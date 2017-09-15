import React from "react";
import moment from "moment";
import Slider from "react-rangeslider";
import {
  Segment,
  Header,
  Accordion,
  Icon,
  Button,
  Loader
} from "semantic-ui-react";

const DAY = 86400000;
const MAX_TICKERS = 3500;
const LATEST = moment()
  .startOf("day")
  .subtract(1, "week");
const EARLIEST = LATEST.clone().subtract(10, "years");

const form = date => moment(date).format("L");

const DateSlider = ({ dates, fetch, isFetching, actions }) => (
  <Segment>
    <Header as="h3">
      {`Trading Day: ${form(dates.array[fetch.current])}`}
    </Header>

    <Slider
      max={dates.array.length - 1}
      value={fetch.current}
      tooltip={false}
      onChange={actions.onChangeCurrent}
      onChangeComplete={actions.onChangeCurrentComplete}
    />

    <Accordion>
      <Loader
        active={isFetching}
        size="large"
        content="This may take a while..."
      />
      <Accordion.Title>
        <Icon name="dropdown" />
        {`Range: ${form(dates.start)} - ${form(dates.end)}`}
      </Accordion.Title>
      <Accordion.Content>
        <Header as="h4">Fetch a new set of stocks:</Header>
        Start: {form(fetch.start)}
        <Slider
          min={+EARLIEST}
          max={+LATEST}
          step={DAY}
          value={fetch.start}
          tooltip={false}
          onChange={actions.onChangeStart}
        />
        End: {form(fetch.end)}
        <Slider
          min={+EARLIEST}
          max={+LATEST}
          step={DAY}
          value={fetch.end}
          tooltip={false}
          onChange={actions.onChangeEnd}
        />
        Stocks: {fetch.stocks}
        <Slider
          min={1}
          max={MAX_TICKERS}
          value={fetch.stocks}
          tooltip={false}
          onChange={actions.onChangeStocks}
        />
        <Button primary onClick={actions.onChangeRange}>
          Fetch!
        </Button>
      </Accordion.Content>
    </Accordion>
  </Segment>
);

export default DateSlider;

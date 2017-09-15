import React from "react";
import { Header, Segment, Grid, Input } from "semantic-ui-react";
import SortableTable from "./elements/SortableTable";

const headers = ["Ticker", "Price", "1d", "7d", "30d"];

const Stocks = ({ stocks, date, sort, filter, onSort, onFilter, onTrade }) => {
  const rows = stocks.map(values => {
    return {
      cells: values,
      onClick: onTrade(values.Ticker)
    };
  });
  return (
    <Segment>
      <Grid>
        <Grid.Column width={6}>
          <Header content="Stocks" subheader="Click any stock to trade:" />
        </Grid.Column>
        <Grid.Column width={10} textAlign="right">
          <Input placeholder="Filter..." value={filter} onChange={onFilter} />
        </Grid.Column>
      </Grid>
      <SortableTable
        rows={rows}
        headers={headers}
        sort={sort}
        onSort={onSort}
        onClick={onTrade}
      />
    </Segment>
  );
};

export default Stocks;

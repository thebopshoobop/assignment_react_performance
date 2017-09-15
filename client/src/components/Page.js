import React from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
import { resourceNames, ResourceContainer } from "../containers/resources";
import Findable from "./elements/Findable";
import DateSliderContainer from "../containers/DateSliderContainer";
import StocksContainerWrapper from "../containers/StocksContainerWrapper";
import PerfProfiler from "./PerfProfiler";

const Page = ({ match }) => {
  const type = match.params.type;
  return (
    <div>
      <Segment>
        <Header as="h1" textAlign="center">
          Fideligard
        </Header>
        <PerfProfiler />
      </Segment>
      <Findable condition={resourceNames.includes(type)}>
        <Grid container={true} stackable>
          <Grid.Row>
            <Grid.Column tablet={16} computer={6}>
              <StocksContainerWrapper />
            </Grid.Column>
            <Grid.Column tablet={16} computer={10}>
              <DateSliderContainer />
              <ResourceContainer type={type} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Findable>
    </div>
  );
};

export default Page;

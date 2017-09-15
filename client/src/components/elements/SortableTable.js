import React from "react";
import { Table, Icon } from "semantic-ui-react";

const HeaderCellContent = (name, sort) => {
  if (name !== sort.column) return name;

  const flip = sort.direction ? "vertically" : undefined;
  return (
    <div>
      {name} <Icon name="dropdown" size="large" flipped={flip} />
    </div>
  );
};

const Row = ({ headers, cells, onClick }) => (
  <Table.Row onClick={onClick}>
    {headers.map(column => (
      <Table.Cell className="clickable" key={column} content={cells[column]} />
    ))}
  </Table.Row>
);

const SortableTable = ({ headers, rows, onClick, sort, onSort }) => (
  <Table size="small" compact={true} celled striped>
    <Table.Header>
      <Table.Row>
        {headers.map(name => (
          <Table.HeaderCell
            onClick={onSort(name)}
            key={name}
            content={HeaderCellContent(name, sort)}
            className="clickable"
          />
        ))}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {rows.map(({ cells, onClick }) => (
        <Row
          headers={headers}
          onClick={onClick}
          key={`${cells[headers[0]]}`}
          cells={cells}
        />
      ))}
    </Table.Body>
  </Table>
);

export default SortableTable;

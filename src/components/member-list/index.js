import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';

const getData = async (setMembers, filters) => {
  try {
    const res = await axios.get('http://localhost:4444/members', {
      params: filters,
    });
    setMembers(res.data);
  } catch (err) {
    console.log('ERROR', err);
  }
};

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  padding: 0 5rem;
`;

const Filters = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 1rem 0;
  > input {
    max-width: 10rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
`;

const Table = styled.table`
  width: calc(100% - 10rem);
  padding: 0 5rem;
  max-width: 100%;
  background: #fff;
  border-radius: 5px;
  border-collapse: collapse;
  box-shadow: 0px 1px 5px 2px #d3d1d1;
`;

export const Thead = styled.thead`
  background: lightgrey;
`;

const TH = styled.th`
  padding: 0.5rem;
  text-align: center;
`;

const Cell = styled.td`
  padding: 0.5rem;
  text-align: center;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #e0f7ff; /* Light shade of blue */
    cursor: pointer;
  }
`;

export const SearchBar = ({ value, onChange }) => (
  <Input
    name='name'
    type='text'
    placeholder='Search for a member'
    value={value}
    onChange={onChange}
  />
);

export const NewMember = () => (
  <Link to={{ pathname: `/member` }}> Add New Member </Link>
);

// Wrapping Row in React.memo to avoid unnecessary re-renders
export const Row = React.memo(
  ({ id, age, name, activities, rating, onClick }) => (
    <TableRow onClick={() => onClick({ id, age, name, activities, rating })}>
      <Cell>{name}</Cell>
      <Cell>{age}</Cell>
      <Cell>{rating}</Cell>
      <Cell>
        {activities.map((activity, i) => (
          <div key={i}>{activity}</div>
        ))}
      </Cell>
    </TableRow>
  )
);

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    rating: '',
    activities: '',
    sortBy: '',
    order: 'asc',
  });
  const navigate = useNavigate();

  useEffect(() => {
    getData(setMembers, filters);
  }, [filters]);

  const handleRowClick = useCallback(
    (member) => {
      navigate('/addmember', { state: { member } });
    },
    [navigate]
  );

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <Block>
      <h1>My Club's Members</h1>
      <Filters>
        <SearchBar
          value={filters.name}
          onChange={handleFilterChange}
          name='name'
        />
        <Input
          type='number'
          placeholder='Filter by rating'
          value={filters.rating}
          onChange={handleFilterChange}
          name='rating'
        />
        <Input
          type='text'
          placeholder='Filter by activities (comma separated)'
          value={filters.activities}
          onChange={handleFilterChange}
          name='activities'
        />

        {/* MUI Select for sorting */}

        <NewMember />
      </Filters>
      <Box
        sx={{
          display: 'block',
          mb: 2,
        }}
      >
        <FormControl sx={{ mr: 4 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
          sx={{width: 150}}
            name='sortBy'
            value={filters.sortBy}
            onChange={handleFilterChange}
            label='Sort by'
          >
            <MenuItem value=''>Sort by</MenuItem>
            <MenuItem value='name'>Name</MenuItem>
            <MenuItem value='rating'>Rating</MenuItem>
          </Select>
        </FormControl>

        {/* MUI Select for order (ascending/descending) */}
        <FormControl>
          <InputLabel>Order</InputLabel>
          <Select
            name='order'
            value={filters.order}
            onChange={handleFilterChange}
            label='Order'
          >
            <MenuItem value='asc'>Ascending</MenuItem>
            <MenuItem value='desc'>Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Table>
        <Thead>
          <tr>
            <TH>Name</TH>
            <TH>Age</TH>
            <TH>Member Rating</TH>
            <TH>Activities</TH>
          </tr>
        </Thead>
        <tbody>
          {members.map((member) => (
            <Row {...member} key={member.id} onClick={handleRowClick} />
          ))}
        </tbody>
      </Table>
    </Block>
  );
};

export default MemberList;

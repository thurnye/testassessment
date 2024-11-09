const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const membersJson = require('./members.json');

let members = [...membersJson];

const app = express();

const corsOptions = { origin: '*', optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

app.use(bodyParser.json());

/**
 * @query query: string
 */
app.get('/members', (req, res) => {
  const { name, rating, activities, sortBy, order } = req.query;

  let filteredMembers = members;

  // Filter by name
  if (name) {
    const q = name.toLowerCase();
    filteredMembers = filteredMembers.filter((member) =>
      member.name.toLowerCase().includes(q)
    );
  }

  // Filter by rating
  if (rating) {
    filteredMembers = filteredMembers.filter((member) => 
      member.rating >= parseFloat(rating)
    );
  }

  // Filter by activities
  if (activities) {
    const activityList = activities.split(',').map((activity) => activity.trim().toLowerCase());
    filteredMembers = filteredMembers.filter((member) =>
      member.activities.some((activity) => activityList.includes(activity.toLowerCase()))
    );
  }

  // Sorting
  if (sortBy) {
    filteredMembers = filteredMembers.sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      }
      return a[sortBy] < b[sortBy] ? 1 : -1;
    });
  }

  console.log('GET filtered /members');
  res.send(filteredMembers);
});



/**
 * @body name: string required
 * @body age: integer
 * @body activities: array[string]
 * @body rating: enum [1-5]
 */
app.post('/members', (req, res) => {
  const body = req.body;
  let newMember = body;

  console.log(body);
  if (body) {
    if (!body.name) {
      res.send('Name is required');
      return;
    }
    newMember = {
      id: Math.floor(10000 + Math.random() * 90000),
      activities: [],
      ...body,
    };
    members.push(newMember);
  }
  res.send(newMember);
});

/**
 * @param id: string required
 *
 * @body name: string required
 * @body age: integer
 * @body activities: array[string]
 * @body rating: enum [1-5]
 */
app.patch('/members/:id', (req, res) => {
  console.log('PATCH /members');
  const id = req.params.id;
  const body = req.body.body;

  if (body) {
    members = members.map((member) => {
      if (member.id === id) {
        return { ...member, ...body };
      }
      return member;
    });
  }
  res.send(req.body);
});

/**
 * @param id: string required
 */
app.delete('/members/:id', (req, res) => {
  console.log('DELETE /members');
  const id = req.params.id;

  const memberIndex = members.findIndex((member) => member.id === id);

  if (memberIndex !== -1) {
    members.splice(memberIndex, 1);
    res.send('Member removed successfully');
  } else {
    res.status(404).send('Member not found');
  }
});

app.get('/filteredMembers', async (req, res) => {
  try {
    const { name, rating, activities, sortBy, order = 'asc' } = req.query;

    // Build the filter object dynamically based on query parameters
    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // Case-insensitive match
    }
    if (rating) {
      filter.rating = parseInt(rating, 10); // Exact rating match
    }
    if (activities) {
      filter.activities = { $in: activities.split(',') }; // Array match for activities
    }

    // Build the sort object based on query parameters
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'asc' ? 1 : -1;
    }

    // Fetch items with filtering and sorting
    const items = await members.find(filter).sort(sort);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = 4444;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

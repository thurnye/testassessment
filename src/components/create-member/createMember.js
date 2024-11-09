import React, { useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './createMember.css';
import { Container, Button, TextField, MenuItem, Select, FormControl, InputLabel, Checkbox, ListItemText } from '@mui/material';
import { useLocation } from 'react-router';

const saveMemberData = async (memberData, isEditing) => {
  try {
    const url = `http://localhost:4444/members${isEditing ? `/${memberData.id}` : ''}`;
    const res = isEditing
      ? await axios.patch(url, memberData)
      : await axios.post(url, memberData);
    return res;
  } catch (err) {
    console.log('ERROR', err);
  }
};

export default function CreateMember({ isEditing = false }) {
  const location = useLocation();
  const member = location.state?.member;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    // Set form values if in editing mode
    if (isEditing && member) {
      reset(member);
    }
  }, [isEditing, member, reset]);

  const onSubmit = async (data) => {
    try {
      console.log({ data });
      const result = await saveMemberData(
        {
          ...(member?.Id && { id: member.Id }),
          ...data,
        },
        isEditing
      );
      if (result && result.status === 200) {
        alert(isEditing ? 'Member Updated Successfully!' : 'Member Added Successfully!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="userForm">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <div className="received-data">
            <div className="form">
              <div className="form-fields">
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  {...register('name', {
                    required: 'Name is required',
                    pattern: {
                      value: /^[A-Za-z]+$/i,
                      message: 'Invalid name format',
                    },
                  })}
                  defaultValue={member?.name || ''}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  margin="normal"
                />
                <TextField
                  label="Age"
                  type="number"
                  variant="outlined"
                  fullWidth
                  {...register('age', {
                    required: 'Age is required',
                  })}
                  defaultValue={member?.age || ''}
                  error={!!errors.age}
                  helperText={errors.age?.message}
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>User Rating</InputLabel>
                  <Select label="User Rating" {...register('rating')} defaultValue={member?.rating || ''}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <MenuItem key={rating} value={rating}>
                        {rating}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Activities</InputLabel>
                  <Select
                    label="Activities"
                    multiple
                    defaultValue={member?.activities || []}
                    onChange={(e) => setValue('activities', e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {['biking', 'running', 'swimming', 'hiking'].map((activity) => (
                      <MenuItem key={activity} value={activity}>
                        <Checkbox checked={member?.activities?.includes(activity) || false} />
                        <ListItemText primary={activity} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="submit-container" style={{ textAlign: 'end' }}>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? 'Update' : 'Submit'}
            </Button>
          </div>
        </Container>
      </form>
    </div>
  );
}

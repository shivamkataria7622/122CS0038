import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from '@mui/material';
import axios from 'axios';

const AverageCalculator = () => {
  const [numberId, setNumberId] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:9876/numbers/${numberId}`);
      setResponse(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Average Calculator
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Number ID (p/f/e/r)"
            value={numberId}
            onChange={(e) => setNumberId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !['p', 'f', 'e', 'r'].includes(numberId)}
            sx={{ mt: 2 }}
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </Button>
        </form>
      </Paper>

      {response && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Previous Window</TableCell>
                  <TableCell>{JSON.stringify(response.windowPrevState)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Current Window</TableCell>
                  <TableCell>{JSON.stringify(response.windowCurrState)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Numbers Received</TableCell>
                  <TableCell>{JSON.stringify(response.numbers)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average</TableCell>
                  <TableCell>{response.avg}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default AverageCalculator;
import React, { useState } from 'react';
import {
  Box, Button, Typography, CircularProgress,
  MenuItem, Select, FormControl, InputLabel, TextField
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';

const DecodeForm = () => {
  const [method, setMethod] = useState('zwc');
  const [inputText, setInputText] = useState('');
  const [inputFile, setInputFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [decodedText, setDecodedText] = useState('');
  const [decodedImage, setDecodedImage] = useState(null);

  const handleDecode = async () => {
    setLoading(true);
    setDecodedText('');
    setDecodedImage(null);

    try {
      let response;
      if (method === 'zwc' || method === 'homoglyph') {
        const endpoint = method === 'zwc' ? 'recover/text-to-text-zwc' : 'recover/text-to-text-uh';
        response = await axios.post(`${API_BASE_URL}${endpoint}`, {
          embedded: inputText
        });
        setDecodedText(response.data.recovered_secret);
      } else {
        const formData = new FormData();
        formData.append('embedded', inputFile);

        let endpoint = '';
        if (method === 'lsb') {
          formData.delete('embedded');
          formData.append('image', inputFile);
          endpoint = 'recover/text-in-image-lsb';
        } else if (method === 'lsb-rgb') endpoint = 'recover/text-in-image-lsb-rgb';
        else if (method === 'imginimg') endpoint = 'recover/image-in-image';
        else if (method === 'deep') endpoint = 'reveal/image-to-image-deep';

        response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
          responseType: method === 'imginimg' || method === 'deep' ? 'blob' : 'json'
        });

        if (method === 'imginimg' || method === 'deep') {
          const imageUrl = URL.createObjectURL(response.data);
          setDecodedImage(imageUrl);
        } else {
          setDecodedText(response.data.recovered_secret);
        }
      }
    } catch (err) {
      alert("Decoding failed: " + (err.response?.data?.detail || err.message));
    }

    setLoading(false);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Decoding Method</InputLabel>
        <Select
          value={method}
          label="Decoding Method"
          onChange={(e) => setMethod(e.target.value)}
        >
          <MenuItem value="zwc">Text ➜ Text (Zero Width Characters)</MenuItem>
          <MenuItem value="homoglyph">Text ➜ Text (Homoglyphs)</MenuItem>
          <MenuItem value="lsb">Image ➜ Text (LSB)</MenuItem>
          <MenuItem value="lsb-rgb">Image ➜ Text (RGB LSB)</MenuItem>
          <MenuItem value="imginimg">Image ➜ Image (LSB)</MenuItem>
          <MenuItem value="deep">Image ➜ Image (Deep Learning)</MenuItem>
        </Select>
      </FormControl>

      {(method === 'zwc' || method === 'homoglyph') && (
        <TextField
          label="Paste encoded text here"
          fullWidth
          multiline
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          margin="normal"
        />
      )}

      {(method !== 'zwc' && method !== 'homoglyph') && (
        <Box sx={{ my: 2 }}>
          <Typography>Upload Image:</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setInputFile(e.target.files[0])}
          />
        </Box>
      )}

      <Button variant="contained" onClick={handleDecode} sx={{ mt: 2 }}>
        Decode
      </Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {decodedText && (
        <Box mt={4}>
          <Typography variant="h6">Decoded Message:</Typography>
          <Typography>{decodedText}</Typography>
        </Box>
      )}

      {decodedImage && (
        <Box mt={4}>
          <Typography variant="h6">Decoded Image:</Typography>
          <img src={decodedImage} alt="Decoded result" width="100%" />
        </Box>
      )}
    </Box>
  );
};

export default DecodeForm;

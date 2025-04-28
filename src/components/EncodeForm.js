import React, { useState } from 'react';
import {
  Box, Button, Typography, CircularProgress,
  MenuItem, Select, FormControl, InputLabel, TextField
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';

const EncodeForm = () => {
  const [method, setMethod] = useState('zwc');
  const [coverText, setCoverText] = useState('');
  const [secretText, setSecretText] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [secretFile, setSecretFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outputText, setOutputText] = useState('');
  const [outputImage, setOutputImage] = useState(null);

  const handleEncode = async () => {
    setLoading(true);
    setOutputText('');
    setOutputImage(null);

    try {
      let response;
      if (method === 'zwc' || method === 'homoglyph') {
        const endpoint = method === 'zwc' ? 'embed/text-to-text-zwc' : 'embed/text-to-text-uh';
        response = await axios.post(`${API_BASE_URL}${endpoint}`, {
          cover: coverText,
          secret: secretText
        });
        if(method === 'zwc') {
          setOutputText(response.data.embedded_text)
        } else {
          setOutputText(response.data.stego_text)
        }
        console.log(outputText);
      } else {
        const formData = new FormData();
        formData.append('secret', secretText);
        formData.append('cover', coverFile);

        let endpoint = '';
        if (method === 'lsb') {
          formData.delete('cover');
          formData.append('image', coverFile);
          endpoint = 'embed/text-in-image-lsb';
        } else if (method === 'lsb-rgb') endpoint = 'embed/text-in-image-lsb-rgb';
        else if (method === 'imginimg') {
          formData.delete('secret');
          formData.append('secret', secretFile);
          endpoint = 'embed/image-in-image';
        } else if (method === 'deep') {
          formData.delete('secret');
          formData.append('secret', secretFile);
          endpoint = 'encode/image-to-image-deep';
        }

        response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
          responseType: 'blob'
        });
        const imageUrl = URL.createObjectURL(response.data);
        setOutputImage(imageUrl);
      }
    } catch (err) {
      alert("Encoding failed: " + (err.response?.data?.detail || err.message));
    }

    setLoading(false);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Encoding Method</InputLabel>
        <Select
          value={method}
          label="Encoding Method"
          onChange={(e) => setMethod(e.target.value)}
        >
          <MenuItem value="zwc">Text ➜ Text (Zero Width Characters)</MenuItem>
          <MenuItem value="homoglyph">Text ➜ Text (Homoglyphs)</MenuItem>
          <MenuItem value="lsb">Text ➜ Image (LSB)</MenuItem>
          <MenuItem value="lsb-rgb">Text ➜ Image (RGB LSB)</MenuItem>
          <MenuItem value="imginimg">Image ➜ Image (LSB)</MenuItem>
          <MenuItem value="deep">Image ➜ Image (Deep Learning)</MenuItem>
        </Select>
      </FormControl>

      {(method === 'zwc' || method === 'homoglyph') && (
        <>
          <TextField
            label="Cover Text"
            fullWidth
            multiline
            rows={3}
            value={coverText}
            onChange={(e) => setCoverText(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Secret Text"
            fullWidth
            multiline
            rows={2}
            value={secretText}
            onChange={(e) => setSecretText(e.target.value)}
            margin="normal"
          />
        </>
      )}

      {(method === 'lsb' || method === 'lsb-rgb') && (
        <>
          <Typography>Upload Cover Image:</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
          />
          <TextField
            label="Secret Text"
            fullWidth
            multiline
            rows={2}
            value={secretText}
            onChange={(e) => setSecretText(e.target.value)}
            margin="normal"
          />
        </>
      )}

      {(method === 'imginimg' || method === 'deep') && (
        <>
          <Typography>Upload Cover Image:</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
          />
          <Typography>Upload Secret Image:</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSecretFile(e.target.files[0])}
          />
        </>
      )}

      <Button variant="contained" onClick={handleEncode} sx={{ mt: 2 }}>
        Encode
      </Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {outputText && (
        <Box mt={4}>
          <Typography variant="h6">Encoded Text:</Typography>
          <Typography>{outputText}</Typography>
        </Box>
      )}

      {outputImage && (
        <Box mt={4}>
          <Typography variant="h6">Encoded Image:</Typography>
          <img src={outputImage} alt="Encoded result" width="100%" style={{ marginBottom: '10px' }} />
          <a href={outputImage} download="encoded_output.png">
            <Button variant="outlined">Download Image</Button>
          </a>
        </Box>
      )}
    </Box>
  );
};

export default EncodeForm;

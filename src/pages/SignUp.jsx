import {
  Box,
  Link,
  Paper,
  Stack,
  Button,
  Divider,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';
import IconifyIcon from '../components/base/IconifyIcon';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Form } from 'react-router-dom';
import Image from '../components/base/Image';
import logoWithText from '/kienos-logo1.png';
import { rootPaths } from '../routes/paths';
import React from 'react';
import axios from '../services/axios';
const REGISTER_URL = '/api/v1/users/register/'  

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [originalPhone, setOriginalPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [errors, setErrors] = useState({});

  const userRef = useRef();
  const errRef = useRef();
  
  useEffect(() => {
      userRef.current?.focus();
  }, [])

  useEffect(() => {
      setErrMsg('');
  }, [originalPhone, email, password])

  const validateEmail = (email) => {
    const gmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return gmailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email); 
  
    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Email không đúng định dạng!',
      }));
    } else {
      setErrors((prevErrors) => {
        const { email, ...rest } = prevErrors; 
        return rest;
      });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setOriginalPhone(value);

    if (value.length > 11 || /[a-zA-Z]/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        originalPhone: 'Số điện thoại không đúng định dạng!',
      }));    
    } else {
      setErrors((prevErrors) => {
        const { originalPhone, ...rest } = prevErrors; 
        return rest;
      });
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  
    if (confirmPassword && value !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Mật khẩu và xác nhận mật khẩu không khớp!',
      }));
    } else if (value.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Mật khẩu phải có tối thiểu 8 kí tự!',
      }));
    }
    else {
      setErrors((prevErrors) => {
        const { confirmPassword, password, ...rest } = prevErrors;
        return rest;
      });
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
  
    if (password.length >= 8 && value !== password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Mật khẩu và xác nhận mật khẩu không khớp!',
      }));
    } else if (password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Mật khẩu phải có tối thiểu 8 kí tự!',
      }));
    }
    else {
      setErrors((prevErrors) => {
        const { confirmPassword, password, ...rest } = prevErrors;
        return rest;
      });
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let emptyErrors = {}; 

    if (!originalPhone) {
      emptyErrors.originalPhone = 'Số điện thoại không được để trống!';
    }

    if (!email) {
      emptyErrors.email = 'Email không được để trống!';
    }

    if (!password) {
      emptyErrors.password = 'Mật khẩu không được để trống!';
    }
    
    if (!confirmPassword) {
      emptyErrors.confirmPassword = 'Mật khẩu không được để trống!';
    }
    
    setErrors((prevErrors) => ({ ...prevErrors, ...emptyErrors }));
    
    if (Object.keys(emptyErrors).length > 0) {
      return
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    const phone = originalPhone.startsWith('0') ? '+84' + originalPhone.slice(1) : originalPhone;

    try {
      const response = await axios.post(REGISTER_URL,
        JSON.stringify({ phone, email, password }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
      );
      
    } catch (err) {
      console.log(err?.response)
        if (!err?.response) {
            setErrMsg('No Server Response');
            return;
        } else if (err.response?.status === 400) {
            setErrMsg('Người dùng với email này đã tồn tại!');
            return;
        } else {
            setErrMsg('Sign up Failed');
            return;
        }
      }
    navigate('/auth/login');
  };

  const handleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <>
    <Form>
    <Box component="figure" mb={5} mx="auto" textAlign="center">
        <Link href={rootPaths.authRoot}>
          <Image src={logoWithText} alt="logo with text" height={160} />
        </Link>
      </Box>
      <Paper
        sx={{
          py: 6,
          px: { xs: 5, sm: 7.5 },
        }}
      >
        <Stack justifyContent="center" gap={5}>
          <Typography variant="h3" textAlign="center" color="text.secondary">
            Create New Account
          </Typography>
          <Typography variant="h6" fontWeight={500} textAlign="center" color="text.primary">
            Have an account?{' '}
            <Link href="/auth/login" underline="none">
              Log In
            </Link>
          </Typography>
          {errMsg && (
            <Typography
              ref={errRef}
              variant="body2"
              color="error"
              textAlign="center"
            >
              {errMsg}
            </Typography>
          )}
          <TextField
            variant="filled"
            label="Phone"
            ref={userRef}
            onChange={handlePhoneChange}
            value={originalPhone}
            error={!!errors.originalPhone} 
            helperText={errors.originalPhone} 
            type="text"
            sx={{
              '.MuiFilledInput-root': {
                bgcolor: 'grey.A100',
                ':hover': {
                  bgcolor: 'background.default',
                },
                ':focus': {
                  bgcolor: 'background.default',
                },
                ':focus-within': {
                  bgcolor: 'background.default',
                },
              },
              borderRadius: 2,
            }}
          />
          <TextField
            variant="filled"
            label="Email"
            ref={userRef}
            onChange={handleEmailChange}
            value={email}
            type="email"
            error={!!errors.email} 
            helperText={errors.email} 
            sx={{
              '.MuiFilledInput-root': {
                bgcolor: 'grey.A100',
                ':hover': {
                  bgcolor: 'background.default',
                },
                ':focus': {
                  bgcolor: 'background.default',
                },
                ':focus-within': {
                  bgcolor: 'background.default',
                },
              },
              borderRadius: 2,
            }}
          />
          <TextField
            variant="filled"
            label="Password"
            ref={userRef}
            onChange={handlePasswordChange}
            value={password}
            type={showPassword ? 'text' : 'password'}
            error={!!errors.password} 
            helperText={errors.password} 
            sx={{
              '.MuiFilledInput-root': {
                bgcolor: 'grey.A100',
                ':hover': {
                  bgcolor: 'background.default',
                },
                ':focus': {
                  bgcolor: 'background.default',
                },
                ':focus-within': {
                  bgcolor: 'background.default',
                },
              },
              borderRadius: 2,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleShowPassword}
                    size="small"
                    edge="end"
                    sx={{
                      mr: 2,
                    }}
                  >
                    {showPassword ? (
                      <IconifyIcon icon="el:eye-open" color="text.secondary" />
                    ) : (
                      <IconifyIcon icon="el:eye-close" color="text.primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="filled"
            label="Confirm Password"
            ref={userRef}
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
            type={showConfirmPassword ? 'text' : 'password'}
            error={!!errors.confirmPassword} 
            helperText={errors.confirmPassword} 
            sx={{
              '.MuiFilledInput-root': {
                bgcolor: 'grey.A100',
                ':hover': {
                  bgcolor: 'background.default',
                },
                ':focus': {
                  bgcolor: 'background.default',
                },
                ':focus-within': {
                  bgcolor: 'background.default',
                },
              },
              borderRadius: 2,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleShowConfirmPassword}
                    size="small"
                    edge="end"
                    sx={{
                      mr: 2,
                    }}
                  >
                    {showConfirmPassword ? (
                      <IconifyIcon icon="el:eye-open" color="text.secondary" />
                    ) : (
                      <IconifyIcon icon="el:eye-close" color="text.primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            onClick={handleSubmit}
            sx={{
              fontWeight: 'fontWeightRegular',
            }}
          >
            Sign Up
          </Button>
          <Typography variant="body1" textAlign="center">
            By creating an account, you agree to our{' '}
            <Link href="#!" underline="none">
              Terms of Service
            </Link>
          </Typography>
          <Divider />
          
          
        </Stack>
      </Paper>
    </Form>
      
    </>
  );
};

export default SignUp;

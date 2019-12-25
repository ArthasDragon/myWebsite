import http from '@http';

export const getOtp = http.post('/user/getopt', { bodyType: 'form' });

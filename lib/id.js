/* global process */
import crypto from 'crypto';

const size = 8;

export const convertCodeToId = (code) => {
  const hexDigest = crypto
    .createHmac('sha256', process.env.DATABASE_CODE_TO_ID_SECRET)
    .update(code)
    .digest('hex')
    .substr(0, size);

  const decDigest = (parseInt(hexDigest, 16) % 10 ** size)
    .toString()
    .padStart(size, '0');

  return decDigest;
};

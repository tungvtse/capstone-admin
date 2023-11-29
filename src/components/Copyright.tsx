import React from 'react';
import { Stack } from 'rsuite';

const Copyright = () => {
  return (
    <Stack className="copyright" justifyContent="center" style={{ height: 40, marginTop: 20 }}>
      <div className="container">
        <p>
          © 2023, Made with ❤️ by{' '}
          <a href="" target="_blank" rel="noreferrer">
            Chanh Xe Mien Tay
          </a>
        </p>
      </div>
    </Stack>
  );
};

export default Copyright;

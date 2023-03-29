import { useEffect } from 'react';
import Header from '../components/header';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Error 404 - Page not found';
  }, []);

  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <p className="text-center text-2xl">This page was not found!</p>
      </div>
    </div>
  );
}
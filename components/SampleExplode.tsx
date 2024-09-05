import { useEffect } from 'react';
import Button from '@mui/material/Button';

type Props = {
  closeModal: () => void;
};

export const SampleExplode = ({ closeModal }: Props) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeModal]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all ease-in-out duration-300 scale-100 opacity-100">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sample Explode</h2>
          <form className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-gray-700">Exploded - to be completed</p>
            </div>
          </form>
          <div className="mt-6 flex justify-end">
            <Button
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                closeModal();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleExplode;
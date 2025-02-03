import { useState, useEffect } from "react";

const TutorialModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const seenTutorial = localStorage.getItem("seenTutorial");
    if (!seenTutorial) {
      setShowModal(true);
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
    localStorage.setItem("seenTutorial", "true");
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-zinc-900 p-4 rounded-lg w-11/12 max-w-lg">
          <button onClick={closeModal} className="text-white float-right">✖</button>
          <h2 className="text-white text-lg font-bold mb-2">How to Set Up API Keys</h2>
          <div className="relative aspect-w-16 aspect-h-9">
            <iframe
              src="https://player.vimeo.com/video/1053170526"
              className="w-full h-72 rounded-lg"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          </div>
          <button onClick={closeModal} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
            Got It!
          </button>
        </div>
      </div>
    )
  );
};

export default TutorialModal;

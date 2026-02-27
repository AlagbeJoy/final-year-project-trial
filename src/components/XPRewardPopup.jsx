import React, { useEffect, useState } from 'react'

function XPRewardPopup({xp}) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        setTimeout(() => setShow(false), 2000);
    }, []);

    if (!show) return null;
  return (
    <div className='fixed top-10 right-10 bg-yellow-300 px-6 py-3 rounded shadow animate-bounce'>
        ⭐+ {xp} XP 
        </div>
  )
}

export default XPRewardPopup
'use client';
import { useState, useEffect } from 'react';

export default function Home() {
    const [isMailboxOpen, setIsMailboxOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMailboxOpen(true);
        }, 1500);

        // return () => clearTimeout(timer);
    }, []);

    const handleMailboxClick = () => {
        if (isMailboxOpen) {
            window.location.href = '/survey';
        }
    };

    return (
        <div className="mx-auto flex w-full flex-col space-y-8 pt-8">
            {/* animation for closed to open mailbox with letter */}
            <img 
                className="mx-auto w-1/2 object-contain transition-opacity duration-500" 
                src={isMailboxOpen ? "mailbox_mail_down.png" : "mailbox_closed.png"} 
                alt={isMailboxOpen ? "Open mailbox with a letter" : "Closed mailbox"}
                onClick={isMailboxOpen ? handleMailboxClick : undefined}
                style={{cursor: isMailboxOpen ? 'pointer' : 'default'}}
            />
            <h1 className="text-center text-4xl font-bold">Welcome to *name here*</h1>
            <p className="text-center text-lg">Looks like you've got mail :D</p>

            {/* login button */}
            <div className="fixed bottom-4 left-4">
                <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    Or login here!
                </button>
            </div>
        </div>
    );
}
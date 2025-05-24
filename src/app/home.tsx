export default function Home() {
    // return <img src="mailbox_mail_down.png" alt="Open mailbox with a letter" className="mx-auto w-64" />;

    // make image fit to page and sit at bottom of the page without scrolling
    return (
        <div className="mx-auto flex w-full flex-col space-y-8 pt-8">
            <img className="mx-auto w-1/2 object-contain" src="mailbox_mail_down.png" alt="Open mailbox with a letter"/>
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
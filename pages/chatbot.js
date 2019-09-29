export default () => {
    return (
        <div style={{ height: '100vh' }}>
            <iframe
                allow="microphone;"
                width="100%"
                height="100%"
                src="https://console.dialogflow.com/api-client/demo/embedded/8d4e7e0b-5413-41cf-b38b-2b2579fc0453">
            </iframe>
            <style global jsx>{`
            body {
                margin: 0;
            }
            `}</style>
        </div>
    )
}
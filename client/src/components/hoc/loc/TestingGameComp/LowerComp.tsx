interface TestingImportProps {
    data: string;
}

const TestingImport: React.FC<TestingImportProps> = ({ data }) => {
    return (
        <>
            <div style={{color: '#FAFAFA'}}>Hello, here is the difficutly: {data}</div>
        </>
    );
};

export default TestingImport;
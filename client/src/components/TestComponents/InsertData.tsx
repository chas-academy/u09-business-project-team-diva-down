const InsertData = (props: { name: string }) => {
    const username = props.name;

    return (
        <>
            <div style={{color: 'hotpink'}}>
                {username}
            </div>
        </>
    );
};

export default InsertData;
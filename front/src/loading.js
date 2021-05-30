import Loader from "react-loader-spinner"

function Loading() {
    return (
        <spinContainer>
            <Loader
                type="ThreeDots"
                color="#44E9C3"
                height={50}
                width={50}
                timeout={30000}
            />
        </spinContainer>
    );
}

export default Loading;
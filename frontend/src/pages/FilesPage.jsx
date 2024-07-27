import "../css/FilePage.css";

const fileContent = "hello";

function FilePage(props) {
  const repoName = "Best project world";
  const username = "Username";
  const fileName = "file.txt";
  const createdOnDate = "june 1st 2024";

  // Check if user can access;

    return (
      <div className="mainDiv">
        <div className="headerSection" style={{ alignItems: "center", backgroundColor: "white", padding: "1px" }}>
          <div className="filePage">
            <p style={{ color: "grey", fontSize: "40px" }}>{repoName}</p>
          </div>
        </div>
        <div className="fileContentPage">
          <div className="fileInfo" style={{ display: "flex", justifyContent: "flex-end" }}>
            <p style={{ color: "white", fontSize: "20px", paddingRight: "10vw" }}>{fileName}</p>
            <p style={{ color: "white", fontSize: "20px" }}>Created on: {createdOnDate}</p>
          </div>
          <div className="fileContent">
            <p style={{ color: "white" }}>{fileContent}</p>
          </div>
        </div>
      </div>
    );
}

export default FilePage;

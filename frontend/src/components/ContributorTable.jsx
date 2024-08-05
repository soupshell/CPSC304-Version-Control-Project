


function ContributorTable(props) {
  const contributorRows = [];
  const contributorNames = props.contributors;

  Object.entries(contributorNames).forEach(([key, value]) => {
    contributorRows.push(
      <tr>
        <td>{key}</td> <td>{value}</td>{" "}
      </tr>
    );
  });

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Contributor Username</th>
          <th>Permissions</th>
        </tr>
      </thead>
      <tbody>{contributorRows}</tbody>
    </table>
  );
}


export default ContributorTable;
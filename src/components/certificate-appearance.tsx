type Props = {
  name: string,
  currentDate: string
}
function certificateOfAppearance({name, currentDate}: Props) {
  return (
    <>
      <div id="print-coa" className="hidden print:block">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
              Certificate of Appearance
            </h1>


            <h2 style={{ fontSize: "22px", marginBottom: "30px" }}>
              This is to certify that
            </h2>


            <p style={{ fontWeight: "bold", fontSize: "20px" }}>
              {name}
            </p>


            <p>
              has appeared before Tangub City Hall on
            </p>


            <p>{currentDate}</p>
          </div>
        </div>
      </div>
    </>
  )
}
export default certificateOfAppearance
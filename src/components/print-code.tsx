type Props = {
  code: string;
};

function PrintCode({ code }: Props) {
  return (
    <div id="print-coa" className="hidden print:flex justify-center">
      <div
        style={{
          width: "58mm", 
          padding: "10px",
          fontFamily: "monospace",
          fontSize: "12px",
          lineHeight: "1.4",
        }}
      >

        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src="/assets/logo-pic.png"
            alt="Logo"
            style={{ width: "40px", margin: "0 auto 6px" }}
          />
          <div style={{ fontWeight: "bold" }}>Tangub City</div>
          <div>Official Receipt</div>
        </div>

        <hr />

        <div style={{ textAlign: "center", margin: "12px 0" }}>
          <div style={{ marginBottom: "6px" }}>YOUR CODE</div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            {code}
          </div>
        </div>

        <hr />
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <div>Please present this code</div>
          <div>Thank you!</div>
        </div>
      </div>
    </div>
  );
}

export default PrintCode;
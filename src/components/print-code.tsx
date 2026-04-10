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
        <div style={{ textAlign: "center", margin: "12px 0" }}>
          <div style={{ marginBottom: "6px" }}>QUEUE NUMBER:</div>
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

      </div>
    </div>
  );
}

export default PrintCode;
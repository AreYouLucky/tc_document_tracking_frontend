type Props = {
  code: string;
};

function PrintCode({ code }: Props) {
  return (
    <div id="print-coa">
      <div
        style={{
          width: "100%",
          textAlign: "center",
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: "14px", marginLeft: "20px" }}>QUEUE NO</div>

        <div
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            letterSpacing: "2px",
            marginTop: "4px",
            marginLeft: "30px"
          }}
        >
          {code}
        </div>
      </div>
    </div>
  );
}

export default PrintCode;
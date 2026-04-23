type Props = {
  code: string;
};

function PrintCode({ code }: Props) {
  return (
    <div id="print-coa" className="hidden print:flex items-center justify-center">
      <div
        style={{
          width: "58mm",
          padding: "0",
          fontFamily: "monospace",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            letterSpacing: "2px",
            lineHeight: "1",
          }}
        >
          {code}
        </div>
      </div>
    </div>
  );
}

export default PrintCode;

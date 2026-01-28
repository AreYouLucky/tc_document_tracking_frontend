import { useEffect, useState } from "react"
import axios from "axios"
const apiUrl = import.meta.env.VITE_API_MAIN_URL;
type Props = {
  name: string
  currentDate: string
  service: string
  code: string
}

type signatory = {
  name: string
  designation: string
}

function CertificateOfAppearance({
  name,
  currentDate,
  service,
  code,
}: Props) {
  const [signatory, setSignatory] = useState<signatory>({
    name: '',
    designation: ''
  });
  useEffect(() => {
    axios.get(`${apiUrl}/api/get-signatory`).then((res) => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setSignatory({
          name: res.data[0].name,
          designation: res.data[0].designation,
        });
      }
    });
  }, []);
  return (
    <div id="print-coa" className="hidden print:block">
      <div
        style={{
          width: "148mm", // A5 width
          height: "210mm", // A5 height
          margin: "0 auto",
          padding: "40px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: "center",
          fontFamily: "serif",
        }}
      >
        {/* Header */}
        <header>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src="/assets/logo-pic.png"
              alt="Tangub City Logo"
              style={{
                width: "100px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          <h1 style={{ fontSize: "26px", letterSpacing: "1px" }}>
            Republic of the Philippines
          </h1>
          <p style={{ fontSize: "16px", marginBottom: "24px" }}>
            Tangub City, Misamis Occidental, 7214
          </p>
          <hr />
        </header>

        {/* Body */}
        <main style={{ padding: "40px 20px" }}>
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "30px",
              textTransform: "uppercase",
            }}
          >
            Certificate of Appearance
          </h2>

          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            This is to certify that
          </p>

          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textDecoration: "underline",
              marginBottom: "24px",
            }}
          >
            {name}
          </p>

          <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
            has personally appeared before the
            <strong> Tangub City Hall </strong>
            on <strong>{currentDate}</strong> for the purpose of
            <strong> requesting {service}</strong> with Tracking Number
            <strong> {code}</strong>.
          </p>
        </main>

        {/* Footer / Signature */}
        <footer>
          <p style={{ fontSize: "16px", marginBottom: "40px" }}>
            Issued this {currentDate} at Tangub City, Philippines.
          </p>

          <div style={{ marginTop: "60px" }}>
            <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              {signatory.name}
            </p>
            <p style={{ fontSize: "14px" }}>{signatory.designation}</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default CertificateOfAppearance

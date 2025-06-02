export default function PaymentFooter({ paymentData }) {
    return (
      <div className="mt-8 text-center">
        <div className="bg-white rounded-lg p-4 shadow-md inline-block">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Enlace válido hasta:</strong> {paymentData.expires_at}
          </p>
          <p className="text-xs text-gray-500">Token: {paymentData.token}</p>
        </div>
      </div>
    )
  }
  
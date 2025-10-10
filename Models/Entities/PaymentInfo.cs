using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Entities
{
    public class PaymentInfo
    {
        [Key]
        public int PaymentInfoId { get; set; }

        [Required]
        public int CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public Customer Customer { get; set; }

        [Required, MaxLength(20)]
        public string PaymentMethod { get; set; } // 'credit', 'debit', 'bank'

        // For card payments
        [MaxLength(100)]
        public string CardName { get; set; }
        [MaxLength(20)]
        public string CardNumber { get; set; }
        [MaxLength(5)]
        public string ExpDate { get; set; }
        [MaxLength(10)]
        public string CVV { get; set; }

        // For bank payments
        [MaxLength(100)]
        public string AccountName { get; set; }
        [MaxLength(30)]
        public string RoutingNumber { get; set; }
        [MaxLength(30)]
        public string AccountNumber { get; set; }
        [MaxLength(20)]
        public string AccountType { get; set; } // 'checking', 'savings'
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Entities
{
    public class Address
    {
        [Key]
        public int AddressId { get; set; }

        [Required]
        public int CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public Customer Customer { get; set; }

        [Required, MaxLength(255)]
        public string Street { get; set; }

        [MaxLength(255)]
        public string Address2 { get; set; }

        [Required, MaxLength(100)]
        public string City { get; set; }

        [Required, MaxLength(50)]
        public string State { get; set; }

        [Required, MaxLength(15)]
        public string Zip { get; set; }
    }
}
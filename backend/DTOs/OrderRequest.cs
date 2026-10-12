using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class OrderRequest
{
    [Required]
    public string Customer { get; set; } = "";

    [Required]
    public string Address { get; set; } = "";

    [Required]
    public string Phone { get; set; } = "";
}
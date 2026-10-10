namespace backend.Models;

public class Order
{
    public int Id{get;set;}
    public string Customer{get;set;}="";
    public string Address{get;set;}="";
    public string Phone{get;set;}="";
    public string Status{get;set;}="Pending";
}
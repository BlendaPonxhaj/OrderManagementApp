namespace backend.Models;

public class User
{
    public int Id{get;set;}
    public string userName{get;set;}="";
    public string passwordHash{get;set;}="";
    public string role{get;set;}="";
}
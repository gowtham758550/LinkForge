using System.Security.Cryptography;
using System.Text;

namespace UrlShortener.Core.Services;

public sealed class UrlHashService
{
    private const string Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private const int CodeLength = 7;

    public string Generate(string longUrl, int attempt = 0)
    {
        var input = attempt == 0 ? longUrl : $"{longUrl}:{attempt}";
        var hash = MD5.HashData(Encoding.UTF8.GetBytes(input));
        return ToBase62(hash)[..CodeLength];
    }

    private static string ToBase62(byte[] bytes)
    {
        var value = new System.Numerics.BigInteger(bytes, isUnsigned: true);
        var base62 = new System.Numerics.BigInteger(62);
        var sb = new StringBuilder();

        while (value > 0)
        {
            value = System.Numerics.BigInteger.DivRem(value, base62, out var remainder);
            sb.Insert(0, Alphabet[(int)remainder]);
        }

        return sb.Length == 0 ? Alphabet[0].ToString() : sb.ToString();
    }
}

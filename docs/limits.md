## amounts

`uint112`

* Uniswap2 limits token amounts to this
* Spec: For an 18 decimal token, more than a million billion tokens (1e15)

## interestRate

`int96`

* "Second Percent Yield"
* Fraction scaled by 1e27
  * Example: `10% APR = 1e27 * 0.1 / (86400*365) = 1e27 * .00000000317097919837`
* Spec: 1 billion % APR, positive or negative

## interestAccumulator

`uint256`

* Starts at 1e27, multiplied by (1e27 + interestRate) every second
* Spec: 100% APR for 100 years
      -> 2^256
      ~= 1.1579208923e+77
      -> 10^27 * (1 + (100/100 / (86400*365)))^(86400*365*100)
      ~= 2.6881128798e+70
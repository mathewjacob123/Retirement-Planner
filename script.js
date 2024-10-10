const reqHeaders = new Headers();
document.addEventListener("DOMContentLoaded", function () {
  const inputs = [
    "monthly-income",
    "current-age",
    "retirement-age",
    "income-age",
    "pre-retirement-rate",
    "post-retirement-rate",
  ];

  function checkZeroValues() {
    let allValid = true;

    inputs.forEach((id) => {
      const input = document.getElementById(id);
      if (parseInt(input.value, 10) === 0) {
        allValid = false;
      }
    });

    const calculateButton = document.getElementById("button");
    if (allValid) {
      calculateButton.classList.add("enabled");
      calculateButton.disabled = false;
    } else {
      calculateButton.classList.remove("enabled");
      calculateButton.disabled = true;
    }
  }

  function updateValueInput(id, value) {
    const valueInput = document.getElementById(id + "-value");
    let suffix = "";
    if (id === "pre-retirement-rate" || id === "post-retirement-rate") {
      suffix = " %";
    } else if (id === "monthly-income") {
      suffix = " ";
      if (value > 999000) {
        value = 999000;
      }
    } else {
      suffix = " years";
    }
    valueInput.value = value.toFixed(0) + suffix;
  }

  function setInputValue(id, value) {
    const input = document.getElementById(id);
    const valueInput = document.getElementById(id + "-value");

    const cursorPosition = valueInput.selectionStart;

    const maxValues = {
      "monthly-income": 9999999,
      "current-age": 65,
      "retirement-age": 75,
      "income-age": 99,
      "pre-retirement-rate": 20,
      "post-retirement-rate": 20,
    };

    if (value > maxValues[id]) {
      value = maxValues[id];
    }

    input.value = value;
    updateValueInput(id, value);

    valueInput.selectionStart = cursorPosition;
    valueInput.selectionEnd = cursorPosition;
  }

  inputs.forEach((id) => {
    const input = document.getElementById(id);
    const valueInput = document.getElementById(id + "-value");

    input.addEventListener("input", () => {
      let value = parseInt(input.value, 10) || 0;
      setInputValue(id, value);
      checkZeroValues();
    });

    valueInput.addEventListener("input", () => {
      const cursorPosition = valueInput.selectionStart;

      valueInput.value = valueInput.value.replace(/[^0-9]/g, "");
      let numericValue = parseInt(valueInput.value, 10) || "";

      setInputValue(id, numericValue);

      valueInput.selectionStart = cursorPosition;
      valueInput.selectionEnd = cursorPosition;

      checkZeroValues();
    });
  });

  function createSliderHandler(id, maxValue, suffix) {
    const slider = document.getElementById(id);
    const valueInput = document.getElementById(id + "-value");

    function updateSlider() {
      let value = slider.value;
      value = Math.min(value, maxValue);
      valueInput.value =
        id === "monthly-income" ? `${suffix} ${value}` : `${value}${suffix}`;
    }

    slider.addEventListener("input", updateSlider);

    valueInput.addEventListener("input", function () {
      let value = valueInput.value.replace(/[^0-9]/g, "");
      value = Math.min(parseInt(value) || 0, maxValue);
      slider.value = value;
      updateSlider();
    });

    valueInput.placeholder = id === "monthly-income" ? `₹ 0` : `0 ${suffix}`;
  }

  // Create handlers for each slider
  createSliderHandler("monthly-income", 9999999, "₹");
  createSliderHandler("current-age", 65, " years");
  createSliderHandler("retirement-age", 75, " years");
  createSliderHandler("income-age", 99, " years");
  createSliderHandler("pre-retirement-rate", 20, " %");
  createSliderHandler("post-retirement-rate", 20, " %");

  const calculateButton = document.getElementById("button");
  calculateButton.addEventListener("click", () => {
    const currentAge = parseInt(
      document.getElementById("current-age").value,
      10
    );
    const retirementAge = parseInt(
      document.getElementById("retirement-age").value,
      10
    );
    const incomeAge = parseInt(document.getElementById("income-age").value, 10);
    const preRetirementRate = parseFloat(
      document.getElementById("pre-retirement-rate").value
    );
    const postRetirementRate = parseFloat(
      document.getElementById("post-retirement-rate").value
    );
    const monthlyIncome = parseInt(
      document.getElementById("monthly-income").value
    );

    let valid = true;

    const currentAgeError = document.getElementById("current-age-error");
    if (currentAge <= 18) {
      currentAgeError.textContent = "Current Age must be greater than 18";
      valid = false;
    } else if (currentAge > 65) {
      currentAgeError.textContent = "Current Age must be smaller than 65";
      valid = false;
    } else {
      currentAgeError.textContent = "";
    }

    const retirementAgeError = document.getElementById("retirement-age-error");
    if (retirementAge <= 50) {
      retirementAgeError.textContent =
        "Retirement age should be greater than 50";
      valid = false;
    } else if (retirementAge <= currentAge + 5) {
      retirementAgeError.textContent =
        "Retirement age should be 5 years more than current age";
      valid = false;
    } else {
      retirementAgeError.textContent = "";
    }

    const incomeAgeError = document.getElementById("income-age-error");
    if (incomeAge <= 55) {
      incomeAgeError.textContent =
        "Life Expectancy Age must be greater than 55";
      valid = false;
    } else if (incomeAge <= retirementAge + 5) {
      incomeAgeError.textContent =
        "Life Expectancy Age should be 5 years more than retirement age";
      valid = false;
    } else {
      incomeAgeError.textContent = "";
    }

    const preRetirementRateError = document.getElementById(
      "pre-retirement-rate-error"
    );
    if (preRetirementRate < 6) {
      preRetirementRateError.textContent =
        "Pre-Retirement rate should be a minimum of 6%";
      valid = false;
    } else {
      preRetirementRateError.textContent = "";
    }

    const postRetirementRateError = document.getElementById(
      "post-retirement-rate-error"
    );
    if (postRetirementRate < 6) {
      postRetirementRateError.textContent =
        "Post-Retirement rate should be a minimum of 6%";
      valid = false;
    } else {
      postRetirementRateError.textContent = "";
    }

    const monthlyIncomeError = document.getElementById("monthly-income-error");
    if (monthlyIncome < 10000) {
      monthlyIncomeError.textContent = "Monthly income should be at least 10K";
      valid = false;
    } else {
      monthlyIncomeError.textContent = "";
    }

    if (valid) {
      const data = {
        presentage: currentAge,
        retireage: retirementAge,
        inflation: 5,
        postretirereturn: postRetirementRate,
        presentexpense: monthlyIncome,
        lifeage: incomeAge,
        estate: 0,
        presentinv: 0,
        preretirereturn: preRetirementRate,
      };
      console.log(data);
      reqHeaders.set(
        "Authorization",
        "ZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmZhV1FpT2pVNU56UXNJbTF2WW1sc1pTSTZJalkwTlRZME5UWTFNelVpTENKaFkyTnZkVzUwZEhsd1pTSTZJbEJsY25OdmJtRnNJaXdpYVdGMElqb3hOekl5TWpNd01qTXpMQ0psZUhBaU9qRTNNalE0TWpJeU16TjkuS3hYOEZpdmM1ZFlJTnhLMVZYeGFyTW03VDVhazVDbGVzR0hVN24wOVYzeGsyck90Tm9RclpRSkJPUU53WWpjMVVIUmJZM043b2lqaE1waW5fbGIzN0hNWm9VOTFaemQzTmkwMGw0Z01vSzhOdTNXZzMyaEtuNzd6Q3NnTTdkR2VLUmU0bU5nY0FKcFdEa1pkbEFXNkRKNEpVc1NKTTRPTVdILU1jNC10VWlqOFFheEJMS191UW5oajlEQll1azY0MmJwSUg2clMxeS1Id1FLY2FQMGZGVXdEbmJ6OFNyb2JrUWRQRlUtXzk5eTNvODVYMm1lLWlCTHZ3WDhUZ0xDRE9CZnRPb3VuN1k4VG92ZHhKdm9lZWE2cnFYbVFkZ0NxdVFHVDdLbnR0eFNXb0hObkg2dGtScGJyZFgwWDh1cFA0Tnd5eXFLRzQ1WTA2cUt6MVo5U241X3B3cVpDMWpJNFh2Y2tOSG5YZDBjX0cweEQxX0FBay10b2daZXF0aWRLMkEzSnpleFJOLVQxVkMxbzVmdUZNYkNwM0RmOGRyNXVRS2VHa04zTk0zdmExcnRoUkdkUlBiN3d2b051TnBfT004WDBZLVp1bDV6dHFONlFZSUJnWjBBSkVzQU9QRzMtY0NwVlZualFSbWdwa1BfR3MzczlDTjFVZFloU2dlb3ZBN3UzTmh0dXFZU01lYjdNUDFqNG1NT1hWREdNT3dIc2J6M3hDQUlPRzFDQVc0NUtDQzc1cU9GeUZybEhPZmlZRFVoTkdaVWZmemx5bFBkbi05QlVGUHF4akVjTUlQbkd0LWUwbWZZLVlxaTNyUC0zckIxZ0JMOTNMc2hWYm81QktaUG45cXdxU09NVXE3WGM2TWdfX3lBM2ZiUmFqVHcxaGtCcnVyT0NDU0k="
      );
      reqHeaders.set("Accept", "application/json");
      reqHeaders.set("content-type", "application/json");
      reqHeaders.set("source", "mobile");

      console.log(data);
      async function fetchRetirementCorpus(data, header) {
        try {
          const response = await fetch(
            "https://dev.floatr.in/api/nps/retirement/corpus",
            {
              method: "POST",
              headers: header,
              body: JSON.stringify(data),
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          displayResults({
            ...result,
          });
          console.log(result);
        } catch (error) {
          console.error("Error:", error);
        }
      }
      fetchRetirementCorpus(data, reqHeaders);
    }
  });
  checkZeroValues();

  function displayResults(apidata) {
    const { data } = apidata;
    console.log(data);
    const resultsDiv = document.getElementById("results");
    const retirementSavingsPlan = document.getElementById(
      "retirement-savings-plan"
    );
    const postRetirementPensionPlan = document.getElementById(
      "post-retirement-pension-plan"
    );
    // function formatToIndianCurrency(value) {
    //   if (isNaN(value) || value === null) return "₹0";
    //   value = parseFloat(value).toFixed(2);

    //   const parts = value.split(".");
    //   const integerPart = parts[0];
    //   const decimalPart = parts[1];

    //   const lastThree = integerPart.slice(-3);
    //   const otherNumbers = integerPart.slice(0, -3);
    //   const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (lastThree ? "," + lastThree : "");

    //   return `₹${formattedInteger}.${decimalPart}`;
    // }
    function formatNumberinSIUnit(value) {
      value = Number(value);
      if (value >= 10000000) {
        return "₹" + (value / 10000000).toFixed(2) + "Cr";
      } else if (value >= 100000) {
        return "₹" + (value / 100000).toFixed(2) + "L";
      } else if (value >= 1000) {
        return "₹" + (value / 1000).toFixed(2) + "K";
      } else {
        return "₹" + value.toString();
      }
    }
    function formatToIndianCurrency(number, key = false, int = false) {
      console.log(number, key);
      if (!number) {
        number = 0;
      } else {
        number = Number(number);
        if (int) {
          number = parseInt(number);
        }
      }
      // if (number > 9999999) {
      //   const siValue = formatNumberinSIUnit(number);
      //   return siValue;
      // }

      if (number < 0) {
        // If the number is less than zero, include a minus sign
        number = Math.abs(number);
        if (key) {
          return `-${number?.toLocaleString("en-IN", {
            minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
            maximumFractionDigits: 2,
          })}`;
        }
        return `-₹${number?.toLocaleString("en-IN", {
          minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
          maximumFractionDigits: 2,
        })}`;
      } else {
        // If the number is greater than or equal to zero
        if (key) {
          return `${number?.toLocaleString("en-IN", {
            minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
            maximumFractionDigits: 2,
          })}`;
        }
        return `₹${number?.toLocaleString("en-IN", {
          minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
          maximumFractionDigits: 2,
        })}`;
      }
    }

    if (retirementSavingsPlan) {
      console.log(data?.retirementcorpus);
      retirementSavingsPlan.innerHTML = `
        <p class="head">My Retirement Savings Plan</p>
        <p>Corpus Needed On Retirement: ${formatToIndianCurrency(
          data?.retirementcorpus ?? 0,
          false,
          true
        )}</p>
        <p>I will start with an Annual Pension of ${formatToIndianCurrency(
          data?.installments[0]?.withdrawalrequired ?? 0
        )} which is equivalent to ${formatToIndianCurrency(
        data?.presentexpense * 12 ?? 0
      )} as on today. This will increase every year by ${
        data?.inflation ?? "Not available"
      }% which is the rate of inflation considered.</p>
        <h3>How to achieve this goal?</h3>
        <p>Option 1, Level SIP: Do a fixed monthly investment of ${formatToIndianCurrency(
          data?.sipfromtoday ?? 0,
          false,
          true
        )} till your retirement</p>
        <p>Option 2, Step Up SIP: Start with a lesser amount of only ${formatToIndianCurrency(
          data?.stepupsip ?? 0,
          false,
          true
        )} monthly and increase it every year by ${
        data?.grwthsip ?? "Not available"
      }%.</p>
      `;
    }

    if (postRetirementPensionPlan) {
      let tableContent = `<table><tr><th>Age</th><th>Corpus</th><th>Pension/Yr</th><th>Net Balance</th></tr>`;
      if (data.installments && Array.isArray(data.installments)) {
        data.installments.forEach((installment) => {
          tableContent += `<tr>
            <td>${installment.withdrawalage ?? "Not available"}y</td>
            <td>${formatToIndianCurrency(installment.corpusbalance ?? 0)}</td>
            <td>${formatToIndianCurrency(
              installment.withdrawalrequired ?? 0
            )}</td>
            <td>${formatToIndianCurrency(
              installment.corpusbalanceafterwithdrawal ?? 0
            )}</td>
          </tr>`;
        });
      }
      tableContent += `</table>`;

      postRetirementPensionPlan.innerHTML = `
        <p class="head">Post Retirement Pension Plan</p>
        <p>Withdrawal will increase every year by ${
          data?.inflation ?? "Not available"
        }%</p>
        <p>Assumed rate of returns on investment post retirement is ${
          data?.postretirereturn ?? "Not available"
        }% per annum</p>
        ${tableContent}
      `;
    }
  }
});

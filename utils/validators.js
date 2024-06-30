// Email validation
exports.validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };
  
  // Password validation (at least 6 characters, contains a number)
  exports.validatePassword = (password) => {
    const re = /^(?=.*[0-9]).{6,}$/;
    return re.test(String(password));
  };
  
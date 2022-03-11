// query : quantiles?var=Alanine.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma&type=split

export {};

const data = {
  'omop_test.db': {
    '5%': 14.175,
    '10%': 16,
    '25%': 17.3,
    '50%': 20.8,
    '75%': 23.85,
    '90%': 36.75,
    '95%': 42.775,
    Mean: 22.5667,
  },
  'test.db': {
    '5%': 14.305,
    '10%': 14.9,
    '25%': 16.7,
    '50%': 21.05,
    '75%': 24.15,
    '90%': 35.4,
    '95%': 40.76,
    Mean: 22.9203,
  },
  'sophia.db': {
    '5%': 17.05,
    '10%': 20.5,
    '25%': 21,
    '50%': 22.4,
    '75%': 24.775,
    '90%': 36.37,
    '95%': 43.79,
    Mean: 25.5347,
  },
  title: 'test',
};

describe('Quantiles', () => {
  test.todo('TODO');
});

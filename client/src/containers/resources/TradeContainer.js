import React from "react";
import queryString from "query-string";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Trade from "../../components/resources/Trade";
import { portfolioActions } from "../../actions";

class TradeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: "",
      action: "Buy",
      quantity: 0,
      symbols: []
    };
  }

  stocks = () => this.props.portfolio.stocks;
  buying = () => this.state.action === "Buy";

  getSymbols = action =>
    action === "Buy" ? this.props.symbols : Object.keys(this.stocks());

  getSymbol = () =>
    queryString.parse(this.props.location.search).ticker ||
    this.state.symbol ||
    this.props.symbols[0];

  setSymbol = symbol => {
    let symbols = this.getSymbols(this.state.action);
    let action = this.state.action;
    [symbols, action] = symbols.length
      ? [symbols, action]
      : [this.getSymbols("Buy"), "Buy"];

    this.setState({ symbol, action, symbols });
  };

  componentDidUpdate(prevProps, prevState) {
    const symbol = this.getSymbol();
    if (symbol && symbol !== prevState.symbol) {
      return this.setSymbol(symbol);
    }

    if (!this.props.symbols.length) return;

    if (!this.state.symbols.length) {
      this.setState({ symbols: this.getSymbols(this.state.action) });
    } else if (!this.buying() && !this.stocks()[this.state.symbol]) {
      this.setState({ action: "Buy", symbols: this.getSymbols("Buy") });
    }
  }

  componentDidMount() {
    let symbol = this.getSymbol();
    if (symbol) {
      this.setSymbol(symbol);
    }
  }

  onChangeAction = (_, { value }) => {
    const [action, symbols] = [value, this.getSymbols(value)];
    if (symbols.length) {
      this.setState({ action, symbols });
    }
  };

  onChangeSymbol = (_, data) => {
    this.props.history.push(`/trade?ticker=${data.value}`);
    this.setState({ symbol: data.value });
  };

  onChangeQuantity = ({ target }) => {
    const quantity = target.value > 0 ? +target.value : 0;
    this.setState({ quantity });
  };

  onPlaceOrder = () => {
    if (!this.state.symbol || !this.state.quantity) return;
    const prices = this.props.prices[this.state.symbol];
    if (!prices) return;
    const cost = prices.Price * this.state.quantity;
    const quantity = this.buying() ? this.state.quantity : -this.state.quantity;
    this.props.makeTrade(this.state.symbol, quantity, cost);
  };

  render() {
    const tradeSymbol = this.state.symbol;
    const balance = this.props.portfolio.balance;
    const dayPrices = this.props.prices;

    let [price, total, balanceAfter] = [0, 0, balance];
    if (dayPrices && dayPrices[tradeSymbol] && dayPrices[tradeSymbol].Price) {
      price = dayPrices[tradeSymbol].Price;
      total = (price * this.state.quantity).toFixed(2);
      balanceAfter = this.buying()
        ? (+balance - +total).toFixed(2)
        : (+balance + +total).toFixed(2);
    }

    const enough = this.stocks()[this.state.symbol] >= this.state.quantity;
    let valid = "";
    if (balanceAfter < 0) {
      valid = "Your balance is not sufficient to purchase this many stocks";
    } else if (!this.buying() && !enough) {
      valid = "You don't have enough of this stock to sell";
    }

    const prices = { balance, balanceAfter, price, total };

    const actions = {
      onChangeAction: this.onChangeAction,
      onChangeSymbol: this.onChangeSymbol,
      onChangeQuantity: this.onChangeQuantity,
      onPlaceOrder: this.onPlaceOrder
    };

    const props = { prices, actions, valid, trade: this.state };

    return <Trade {...props} />;
  }
}

const mapStateToProps = state => {
  return {
    symbols: state.stocks.symbols,
    dates: { ...state.dates, range: state.stocks.dates },
    prices: state.stocks.records[state.dates.current],
    portfolio: state.portfolio
  };
};
const mapDispatchToProps = dispatch => {
  return {
    makeTrade: (ticker, quantity, cost) =>
      dispatch(portfolioActions.makeTrade(ticker, quantity, cost))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TradeContainer)
);

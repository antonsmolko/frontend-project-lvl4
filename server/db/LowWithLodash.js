import _ from 'lodash';
import { Low } from 'lowdb';

class LowWithLodash extends Low {
	constructor (adapter) {
		super(adapter);

		this.chain = _.chain(this).get('data');
	}
}

export default LowWithLodash;

import {Buffer} from 'node:buffer';
import {execa} from 'execa';
import isJpg from 'is-jpg';
import mozjpeg from 'mozjpeg';

const imageminMozjpeg = options => async buffer => {
	options = {
		trellis: true,
		trellisDC: true,
		overshoot: true,
		...options,
	};

	if (!Buffer.isBuffer(buffer)) {
		throw new TypeError('Expected a buffer');
	}

	if (!isJpg(buffer)) {
		return buffer;
	}

	// TODO: Remove these sometime far in the future
	if (options.fastcrush) {
		throw new Error('Option `fastcrush` was renamed to `fastCrush`');
	}

	if (options.maxmemory) {
		throw new Error('Option `maxmemory` was renamed to `maxMemory`');
	}

	if (options.notrellis) {
		throw new Error('Option `notrellis` was renamed to `trellis` and inverted');
	}

	if (options.noovershoot) {
		throw new Error('Option `noovershoot` was renamed to `overshoot` and inverted');
	}

	const args = [];

	if (options.quality !== undefined) {
		args.push('-quality', options.quality);
	}

	if (options.progressive === false) {
		args.push('-baseline');
	}

	if (options.targa) {
		args.push('-targa');
	}

	if (options.revert) {
		args.push('-revert');
	}

	if (options.fastCrush) {
		args.push('-fastcrush');
	}

	if (options.dcScanOpt !== undefined) {
		args.push('-dc-scan-opt', options.dcScanOpt);
	}

	if (!options.trellis) {
		args.push('-notrellis');
	}

	if (!options.trellisDC) {
		args.push('-notrellis-dc');
	}

	if (options.tune) {
		args.push(`-tune-${options.tune}`);
	}

	if (!options.overshoot) {
		args.push('-noovershoot');
	}

	if (options.arithmetic) {
		args.push('-arithmetic');
	}

	if (options.dct) {
		args.push('-dct', options.dct);
	}

	if (options.quantBaseline) {
		args.push('-quant-baseline', options.quantBaseline);
	}

	if (options.quantTable !== undefined) {
		args.push('-quant-table', options.quantTable);
	}

	if (options.smooth) {
		args.push('-smooth', options.smooth);
	}

	if (options.maxMemory) {
		args.push('-maxmemory', options.maxMemory);
	}

	if (options.sample) {
		args.push('-sample', options.sample.join(','));
	}

	const {stdout} = await execa(mozjpeg, args, {
		encoding: 'buffer',
		input: buffer,
		maxBuffer: Number.POSITIVE_INFINITY,
	});

	return stdout;
};

export default imageminMozjpeg;

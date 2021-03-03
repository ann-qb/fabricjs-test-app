import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export default function ListComponent() {
	const canvasRef = useRef();
	useEffect(() => {
		const canvas = new fabric.Canvas(canvasRef.current, {
				backgroundColor: 'rgba(255, 255, 255, 1)',
				width: 1000,
				height: 800,
			}),
			text =
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nInteger nec odio.\nPraesent libero. Sed cursus ante dapibus diam.';

		const t = new ListBox(text);
		canvas.add(t);
	}, []);

	return <canvas ref={canvasRef}></canvas>;
}

const ListBox = fabric.util.createClass(fabric.Textbox, {
	type: 'list',
	fontFamily: 'sans-serif',
	fontSize: 24,
	lineHeight: 1.4,
	left: 75,
	top: 50,
	width: 350,
	objectCaching: false,
	isWrapping: false,
	listType: 'bullet',
	listBullet: '✱',
	listCounter: 0,
	initialize: function (options) {
		options || (options = {});
		this.callSuper('initialize', options);
		this.set('label', options.label || '');
	},
	toObject: function () {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			label: this.get('label'),
		});
	},
	_renderTextLine: function (method, ctx, line, left, top, lineIndex) {
		const style0 = this.getCompleteStyleDeclaration(lineIndex, 0),
			bullet = this.listType === 'bullet' ? [this.listBullet] : [this.listCounter + 1 + '.'],
			bulletLeft = left - style0.fontSize - 2;
		if (line.length) {
			if (!this.isWrapping) {
				// render the bullet
				this._renderChars(method, ctx, bullet, bulletLeft, top, lineIndex);
				this.isWrapping = !this.isEndOfWrapping(lineIndex);
				if (!this.isWrapping) this.listCounter++;
			} else if (this.isEndOfWrapping(lineIndex)) {
				this.isWrapping = false;
				this.listCounter++;
			}
		}
		if (lineIndex === this.textLines.length - 1) {
			this.isWrapping = false;
			this.listCounter = 0;
		}
		// render the text line
		this._renderChars(method, ctx, line, left, top, lineIndex);
	},
});

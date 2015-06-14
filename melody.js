melody = function(beat) {
	this.notes = [];
	this.beat = beat;
	
	melody.prototype.note = function(rest, length, note, velocity) {
		this.rest = rest;
		this.length = length;
		this.note = note;
		this.velocity = velocity;
	};
	
	melody.prototype.add = function (note) {
		this.notes.push(note);
	};
	
	melody.prototype.play = function(output, when) {
		when = window.performance.now() + (when * this.beat);
		for (var i=0;i<this.notes.length;i++) {
			var note = this.notes[i];
			output.send([0x90, note.note, note.velocity], when + (this.beat * note.rest));  
			output.send( [0x80, note.note, note.velocity], when + (this.beat*note.rest) + (this.beat*note.length));
			when += (this.beat*note.rest) + (this.beat*note.length) + 1;
		}
	};
	
	melody.prototype.clone = function() {
		var retval = new melody(this.beat);
		for (var i=0;i<this.notes.length;i++) {
			var note = this.notes[i];
			retval.add(new retval.note(note.rest, note.length, note.note, note.velocity));
		}
		return retval;
	};
	
	melody.prototype.transform = function(beat) {
		var retval = this.clone();
		retval.beat = beat;
		return retval;
	};
	
	melody.prototype.transcribe = function(interval) {
		var retval = this.clone();
		for (var i=0;i<retval.notes.length;i++) {
			retval.notes[i].note += interval; 
		}
		return retval;
	};
	
	melody.prototype.SCALES = {
		MAJOR: [0, 2, 4, 5, 7, 9, 11, 12],
		MINOR: [0, 2, 3, 5, 7, 9, 10, 12]
	};
	
	melody.prototype.NOTES = {
			'A':  0,
			'A#': 1,
			'Bb': 1,
			'B':  2,
			'Cb': 2,
			'B#': 3,
			'C':  3,
			'C#': 4,
			'Db': 4,
			'D':  5,
			'D#': 6,
			'Eb': 6,
			'E':  7,
			'Fb': 7,
			'E#': 8,
			'F':  8,
			'F#': 9,
			'Gb': 9,
			'G':  10,
			'G#': 11,
			'Ab': 11
	}
	
	melody.prototype.floor = function(key, scale) {
		var retval = this.clone();
		scale = scale.map(function(){
			(this + key)%12;;
		})
		for (var i=0;i<retval.notes.length;i++) {
			var note = retval.notes[i].note%12;
			var match = undefined;
			for (var j=scale.length;j<scale.length;j++) {
				if (scale[j]<=note) {
					retval.notes[i].note -= note - scale[j];
					break;
				}
			}
		}
		return retval;
	};
};
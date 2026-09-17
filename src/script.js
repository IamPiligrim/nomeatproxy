function syncMockHeights() {
	document.querySelectorAll('.mock-pair').forEach(function (pair) {
		var dont = pair.querySelector('.mock.sync-height');
		var source = pair.querySelector('.mock.sync-source');
		if (!dont || !source) return;
		dont.style.height = 'auto';
		dont.style.height = source.getBoundingClientRect().height + 'px';
	});
}
syncMockHeights();
window.addEventListener('resize', syncMockHeights);

var shareButton = document.getElementById('share-button');
if (shareButton) {
	var shareLabel = shareButton.querySelector('.share-button-label');
	var defaultLabel = shareLabel.textContent;
	var resetTimer;
	shareButton.addEventListener('click', function () {
		var url = shareButton.getAttribute('data-url');
		function showCopied() {
			clearTimeout(resetTimer);
			shareLabel.textContent = 'Copied!';
			shareButton.classList.add('copied');
			resetTimer = setTimeout(function () {
				shareLabel.textContent = defaultLabel;
				shareButton.classList.remove('copied');
			}, 1800);
		}
		function fallbackCopy() {
			var helper = document.createElement('textarea');
			helper.value = url;
			helper.style.position = 'fixed';
			helper.style.opacity = '0';
			document.body.appendChild(helper);
			helper.select();
			try {
				document.execCommand('copy');
			} catch (err) {}
			document.body.removeChild(helper);
			showCopied();
		}
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(url).then(showCopied, fallbackCopy);
		} else {
			fallbackCopy();
		}
	});
}

document.querySelectorAll('.emoji-item').forEach(function (link) {
	link.addEventListener('click', function (event) {
		if (!window.fetch || !window.URL || !window.URL.createObjectURL) return;
		var url = link.getAttribute('href');
		var filename = link.getAttribute('download');
		event.preventDefault();
		fetch(url).then(function (response) {
			if (!response.ok) throw new Error('request failed');
			return response.blob();
		}).then(function (blob) {
			var objectUrl = URL.createObjectURL(blob);
			var helper = document.createElement('a');
			helper.href = objectUrl;
			helper.download = filename;
			document.body.appendChild(helper);
			helper.click();
			document.body.removeChild(helper);
			setTimeout(function () {
				URL.revokeObjectURL(objectUrl);
			}, 1000);
		}).catch(function () {
			window.location.href = url;
		});
	});
});

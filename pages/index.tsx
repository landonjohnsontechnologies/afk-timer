import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../lib/context";
import styles from "../styles/Home.module.scss";

const timeArray = Array.from({ length: 59 }, (_, i) => i + 1);

export default function Home() {
  const [time, setTime] = useState({
    target: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [counter, setCounter] = useState<any>(null);
  const { theme, setTheme } = useContext(ThemeContext);
  const [active, setActive] = useState("light");
  const [view, setView] = useState({
    interface: true,
    countdown: false,
    menu: false,
    message: "",
  });
  const dateRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLSelectElement>(null);
  const minuteRef = useRef<HTMLSelectElement>(null);
  const secondRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);

  const handleDate = () => {
    console.log(dateRef.current?.value);
  };
  const handleHour = () => {
    console.log(hourRef.current?.value);
  };
  const handleMinute = () => {
    console.log(minuteRef.current?.value);
  };
  const handleSecond = () => {
    console.log(secondRef.current?.value);
  };
  const handleMessage = () => {
    console.log(messageRef.current?.value);
  };

  const countdownTimer = (
    target: number,
    hours: number,
    minutes: number,
    seconds: number
  ) => {
    setTime((currentValues) => ({ ...currentValues, target: target }));
    const newCounter = setInterval(() => {
      if (seconds >= 0) {
        seconds--;
      }
      setTime((currentValues) => ({ ...currentValues, seconds: seconds }));
      if (seconds == -1 && minutes > 0) {
        minutes--;
        seconds = 59;
        setTime((currentValues) => ({
          ...currentValues,
          minutes: minutes,
          seconds: seconds,
        }));
      }
      if (seconds == -1 && minutes <= 0 && hours > 0) {
        hours--;
        seconds = 59;
        minutes = 59;
        setTime((currentValues) => ({
          ...currentValues,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        }));
      }
      if (seconds == 0 && minutes == 0 && hours == 0) {
        clearInterval(newCounter);
      }
    }, 1000);
    setCounter(newCounter);
  };

  const openView = (newView: string) => {
    setView((currentValues) => ({ ...currentValues, [newView]: true }));
  };

  const closeView = (newView: string) => {
    setView((currentValues) => ({ ...currentValues, [newView]: false }));
  };

  const handleCountdown = (method: string) => {
    if (method == "date") {
      //TODO: think this out
      // const newTarget = new Date(dateRef.current?.value as string).doSomethingHere???;
      // countdownTimer(newTarget);
      closeView("interface");
      openView("countdown");
    }
    if (method == "time") {
      let hoursTarget = parseInt(hourRef.current?.value as string);
      let minutesTarget = parseInt(minuteRef.current?.value as string);
      let secondsTarget = parseInt(secondRef.current?.value as string);
      let newTarget = hoursTarget * 3600 + minutesTarget * 60 + secondsTarget;
      countdownTimer(newTarget, hoursTarget, minutesTarget, secondsTarget);
      setTime((currentValues) => ({
        ...currentValues,
        hours: hoursTarget,
        minutes: minutesTarget,
        seconds: secondsTarget,
      }));
      closeView("interface");
      openView("countdown");
    }
    if (method == "stop") {
      clearInterval(counter);
      openView("interface");
      closeView("countdown");
    }
    setView((currentValues) => ({
      ...currentValues,
      message: messageRef.current?.value as string,
    }));
    closeView("menu");
  };

  useEffect(() => {
    if (time.hours == 0 && time.minutes == 0 && time.seconds == 0) {
      clearInterval(counter);
      openView("finished");
    }
  }, [time]);

  useEffect(() => {
    const oldTheme = localStorage.getItem("theme");
    setActive(oldTheme as string);

    // if (null !== counter) {
    //   clearInterval(counter);
    // }
  }, []);

  const handleTheme = () => {
    if (active == "light") {
      localStorage.setItem("theme", "dark");
      document.body.classList.replace("light", "dark");
      document.body.classList.add("dark");
      setActive("dark");
      setTheme("dark");
    }
    if (active == "dark") {
      localStorage.setItem("theme", "dark");
      document.body.classList.replace("dark", "light");
      document.body.classList.add("light");
      setActive("light");
      setTheme("light");
    }
  };

  return (
    <div>
      <Head>
        <title>Countdown Timer</title>
        <meta name="description" content="Countdown Timer by ljtech" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {view.countdown && (
          <div>
            <div className={styles.countdown}>
              <div>target: {time.target}</div>
              <span>
                {time.hours.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
                :
              </span>
              <span>
                {time.minutes.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
                :
              </span>
              <span>
                {time.seconds.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </span>
              <div>{view.message}</div>
            </div>
          </div>
        )}
        {view.interface && (
          <form className={styles.interface}>
            <div className={styles.block}>
              <div>choose a date</div>
              <div className={styles.fieldset}>
                <label htmlFor="date">
                  <input
                    ref={dateRef}
                    defaultValue=""
                    type="datetime-local"
                    onChange={handleDate}
                  />
                </label>
              </div>
            </div>
            <div className={styles.block}>
              <div>or choose a time</div>
              <div className={styles.timers}>
                <div className={styles.fieldset}>
                  <label htmlFor="hour">
                    <select
                      ref={hourRef}
                      name="hour"
                      onChange={handleHour}
                      size={3}
                      defaultValue={0}
                    >
                      <option value={0}>00</option>
                      {timeArray.map((i) => (
                        <option key={`hour-${i}`} value={i}>
                          {i.toLocaleString("en-US", {
                            minimumIntegerDigits: 2,
                            useGrouping: false,
                          })}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={styles.fieldset}>
                  <label htmlFor="minute">
                    <select
                      ref={minuteRef}
                      name="minute"
                      onChange={handleMinute}
                      size={3}
                      defaultValue={0}
                    >
                      <option value={0}>00</option>
                      {timeArray.map((i) => (
                        <option key={`minute-${i}`} value={i}>
                          {i.toLocaleString("en-US", {
                            minimumIntegerDigits: 2,
                            useGrouping: false,
                          })}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={styles.fieldset}>
                  <label htmlFor="second">
                    <select
                      ref={secondRef}
                      name="second"
                      onChange={handleSecond}
                      size={3}
                      defaultValue={0}
                    >
                      <option value={0}>00</option>
                      {timeArray.map((i) => (
                        <option key={`second-${i}`} value={i}>
                          {i.toLocaleString("en-US", {
                            minimumIntegerDigits: 2,
                            useGrouping: false,
                          })}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className={styles.fieldset}>
                <label htmlFor="message">
                  <input
                    ref={messageRef}
                    name="message"
                    type="text"
                    placeholder="message"
                    onChange={handleMessage}
                  />
                </label>
              </div>
            </div>
          </form>
        )}
      </main>
      <div className={styles.footer}>
        <a
          className={styles.logo}
          rel="noreferrer"
          href="https://ljtech.ca"
          target="_blank"
        >
          <span className={styles.image}>
            <Image alt="logo" src="/logo-blue.svg" width={24} height={24} />
          </span>
          ljtech
        </a>
      </div>
      <div className={styles.footer}>
        {!view.countdown && (
          <div className={styles.container}>
            <button
              className={styles.button}
              onClick={
                view.menu ? () => closeView("menu") : () => openView("menu")
              }
            >
              start
            </button>
            <div className={view.menu ? styles.menu__active : styles.menu}>
              <button
                className={styles.button}
                onClick={() => handleCountdown("date")}
              >
                date
              </button>
              <button
                className={styles.button}
                onClick={() => handleCountdown("time")}
              >
                time
              </button>
            </div>
          </div>
        )}
        {view.countdown && (
          <button
            className={styles.button}
            onClick={() => handleCountdown("stop")}
          >
            stop
          </button>
        )}
        <button className={styles.button} onClick={handleTheme}>
          theme
        </button>
      </div>
    </div>
  );
}

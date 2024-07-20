import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MoreHorizontalIcon,
} from '@/client/utility/assets/Icons';
import { useCalendar } from '@/client/business/common/useCalendar';

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

const Calendar = ({ calendarEvents }) => {
  const {
    currentDate,
    selectedDate,
    modalPosition,
    isModalVisible,
    calendarRef,
    modalRef,

    daysInMonth,
    firstDayOfMonth,
    lastDayOfPrevMonth,
    daysFromNextMonth,

    prevMonth,
    nextMonth,
    formatDate,
    handleDateClick,
    closeModal,
  } = useCalendar();

  const renderDateCell = (day, month, index) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + (month === 'prev' ? -1 : month === 'next' ? 1 : 0),
      day,
    );
    const dateString = formatDate(date);
    const events = calendarEvents[dateString] || [];
    const displayEvents = events.slice(0, 2);
    const remainingEvents = events.length - displayEvents.length;

    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = dateString === selectedDate;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    return (
      <div
        key={`${month}-${day}`}
        data-index={index}
        className={`date-cell border rounded-lg p-2 h-28 overflow-hidden cursor-pointer hover:bg-gray-50 
          ${isToday ? 'bg-blue-100' : ''}
          ${month !== 'current' ? 'opacity-50' : ''}
          ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => handleDateClick(day, month, e)}
      >
        <div className={`font-semibold mb-1 ${isWeekend ? 'text-red-500' : ''}`}>{day}</div>
        {displayEvents.map((event, index) => (
          <div key={index} className='text-xs mb-1 bg-green-100 p-1 rounded truncate'>
            <span className='font-medium'>{event.time}</span> {event.title}
          </div>
        ))}
        {remainingEvents > 0 && (
          <div className='text-xs text-gray-500 flex items-center'>
            <MoreHorizontalIcon className='w-4 h-4 mr-1' />
            {remainingEvents}개 더보기
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className='max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden relative'
      ref={calendarRef}
    >
      <div className='flex items-center justify-between px-6 py-4 bg-gray-100'>
        <button onClick={prevMonth} className='p-2 rounded-full hover:bg-gray-200'>
          <ChevronLeftIcon className='w-6 h-6' />
        </button>
        <h2 className='text-xl font-semibold'>
          {currentDate.toLocaleString('ko-KR', { year: 'numeric', month: 'long' })}
        </h2>
        <button onClick={nextMonth} className='p-2 rounded-full hover:bg-gray-200'>
          <ChevronRightIcon className='w-6 h-6' />
        </button>
      </div>
      <div className='grid grid-cols-7 gap-2 p-4'>
        {dayNames.map((day) => (
          <div key={day} className='text-center font-medium text-gray-500 p-2'>
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }, (_, i) =>
          renderDateCell(lastDayOfPrevMonth - firstDayOfMonth + i + 1, 'prev', i),
        )}
        {Array.from({ length: daysInMonth }, (_, i) =>
          renderDateCell(i + 1, 'current', i + firstDayOfMonth),
        )}
        {Array.from({ length: daysFromNextMonth }, (_, i) =>
          renderDateCell(i + 1, 'next', i + firstDayOfMonth + daysInMonth),
        )}
      </div>
      {isModalVisible && selectedDate && (
        <div
          ref={modalRef}
          className='modal-123 absolute bg-white rounded-lg shadow-2xl p-4 w-72 transition-all duration-200 ease-in-out'
          style={{ top: `${modalPosition.top}px`, left: `${modalPosition.left}px` }}
        >
          <div className='flex justify-between items-center mb-3'>
            <h3 className='text-lg font-bold text-gray-800'>
              {new Date(selectedDate).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
              })}{' '}
              일정
            </h3>
            <button
              onClick={closeModal}
              className='text-gray-500 hover:text-gray-700 transition-colors'
            >
              <CloseIcon className='w-5 h-5' />
            </button>
          </div>
          {calendarEvents[selectedDate] ? (
            <ul className='space-y-3 max-h-64 overflow-y-auto'>
              {calendarEvents[selectedDate].map((event, index) => (
                <li key={index} className='bg-blue-50 rounded-lg p-2'>
                  <div className='font-semibold text-blue-800'>
                    {event.time} - {event.title}
                  </div>
                  <div className='text-sm text-gray-600'>{event.description}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500 italic'>등록된 일정이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
